import axios from 'axios';
import PageConnection from '../models/PageConnection.model.ts';
import { Request, Response } from 'express';
import { ENV } from '../config/env.ts';

export const startOAuth = (req: Request, res: Response) => {
  const redirectUri = `${ENV.META_CONFIG.BACKEND_URL}/auth/meta/callback`;
  console.log('🔗 Redirect URI (startOAuth):', redirectUri);

  const scopes = [
    'pages_show_list',
    'leads_retrieval',
    'pages_manage_metadata',
    'instagram_basic',
    'instagram_manage_messages',
    'pages_messaging'
  ].join(',');

  const state = 'secure-random-string-or-jwt 123';
  const authUrl =
    `https://www.facebook.com/v24.0/dialog/oauth?client_id=${ENV.META_CONFIG.APP_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&response_type=code` +
    `&state=${encodeURIComponent(state)}`;

  res.redirect(authUrl);
};

export const metaCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

  try {
    const redirectUri = `${ENV.META_CONFIG.BACKEND_URL}/auth/meta/callback`;
    console.log('🔗 Redirect URI (callback):', redirectUri);

    // 1️⃣ Short-lived token
    const tokenResp = await axios.get('https://graph.facebook.com/v24.0/oauth/access_token', {
      params: {
        client_id: ENV.META_CONFIG.APP_ID,
        redirect_uri: redirectUri,
        client_secret: ENV.META_CONFIG.APP_SECRET,
        code
      }
    });
    const shortLivedToken = tokenResp.data.access_token;

    // 2️⃣ Long-lived token
    const longResp = await axios.get('https://graph.facebook.com/v24.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: ENV.META_CONFIG.APP_ID,
        client_secret: ENV.META_CONFIG.APP_SECRET,
        fb_exchange_token: shortLivedToken
      }
    });
    const longLivedToken = longResp.data.access_token;

    // 3️⃣ Get user pages
    const pagesResp = await axios.get('https://graph.facebook.com/v24.0/me/accounts', {
      params: { access_token: longLivedToken }
    });

    const pages = pagesResp.data.data || [];
    if (!pages.length) {
      return res.redirect(`${ENV.META_CONFIG.FRONTEND_URL}/integrations?error=no-pages`);
    }

    // Pick the first for now
    const page = pages[0];
    const pageId = page.id;
    const pageName = page.name;
    const pageAccessToken = page.access_token;

    // 4️⃣ Get connected Instagram
    const igResp = await axios.get(`https://graph.facebook.com/v24.0/${pageId}`, {
      params: { fields: 'instagram_business_account', access_token: pageAccessToken }
    });
    const instagramBusinessId = igResp.data.instagram_business_account?.id || null;

    // 5️⃣ Subscribe page to webhook
    await axios.post(`https://graph.facebook.com/v24.0/${pageId}/subscribed_apps`, null, {
      params: {
        subscribed_fields: 'messages,messaging_postbacks,leadgen',
        access_token: pageAccessToken
      }
    });

    // 6️⃣ Save connection to DB
    await PageConnection.findOneAndUpdate(
      { pageId },
      {
        pageId,
        pageName,
        pageAccessToken,
        instagramBusinessId,
        longLivedToken
      },
      { upsert: true, new: true }
    );

    res.redirect(`${ENV.META_CONFIG.FRONTEND_URL}/integrations?status=connected`);
  } catch (err) {
    // console.error('OAuth error:', err.response?.data || err.message);
    console.log(err);
    res.redirect(`${ENV.META_CONFIG.FRONTEND_URL}/integrations?status=error`);
  }
};

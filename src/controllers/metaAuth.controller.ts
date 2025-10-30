import axios from 'axios';
import PageConnection from '../models/PageConnection.model.ts';
import { Request, Response } from 'express';
import { ENV } from '../config/env.ts';
import jwt from 'jsonwebtoken';
import IntegrationModel from '../models/integration.model.ts';
export const startOAuth = (req: Request, res: Response) => {
  const { ndid } = req.query;
  console.log(ndid);

  const redirectUri = `${ENV.META_CONFIG.BACKEND_URL}/api/v1/auth/meta/callback`;
  console.log('🔗 Redirect URI (startOAuth):', redirectUri);

  const scopes = [
    'pages_show_list',
    'leads_retrieval',
    'pages_manage_metadata',
    'instagram_basic',
    'instagram_manage_messages',
    'pages_messaging',
    'pages_read_engagement',
    'pages_read_user_content',
    'pages_manage_ads'
  ].join(',');

  // 👇 Securely encode ndid in state (expires in 5 minutes)
  const state = jwt.sign({ ndid }, 'secure-random-string-or-jwt', { expiresIn: '5m' });
  const authUrl =
    `https://www.facebook.com/v24.0/dialog/oauth?client_id=${ENV.META_CONFIG.APP_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&response_type=code` +
    `&state=${encodeURIComponent(state)}`;

  res.redirect(authUrl);
};

export const metaCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  if (!code || !state || typeof state !== 'string')
    return res.status(400).send('Missing or invalid code/state');

  interface JWTPayload {
    ndid: string;
  }
  let decoded;
  try {
    decoded = jwt.verify(state, 'secure-random-string-or-jwt') as JWTPayload;
  } catch (err) {
    console.error('❌ Invalid or expired state:', err);
    return res.status(400).json({ error: 'Invalid or expired state' });
  }

  const ndid = decoded?.ndid;
  console.log('✅ Decoded ndid from state:', ndid);
  try {
    const redirectUri = `${ENV.META_CONFIG.BACKEND_URL}/api/v1/auth/meta/callback`;
    console.log('🔗 Redirect URI (callback):', redirectUri);

    console.log('aaya');
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
    const pagesResp = await axios.get('https://graph.facebook.com/v24.0/me', {
      params: {
        fields: 'id,name,email,picture,accounts',
        access_token: longLivedToken
      }
    });

    // const pages = pagesResp.data.data || [];

    console.log('Pages response :', pagesResp);
    console.log('Pages data :', pagesResp.data);
    // console.log('Pages data dataa :', pagesResp.data.data);
    // console.log('Pages data account:', pagesResp.data.accounts);
    // console.log('Pages data account data:', pagesResp.data.accounts.data);
    // if (!pages.length) {
    //   return res.redirect(`${ENV.META_CONFIG.FRONTEND_URL}/integrations?error=no-pages`);
    // }

    // const dataToSave={
    //   "account_id":pagesResp.data.id,
    //   "account_name":pagesResp.data.name,
    //   "pages":pagesResp.data.accounts.data
    // }
    // // Pick the first for now
    // const page = pages[0];
    // const pageId = page.id;
    // const pageName = page.name;
    // const pageAccessToken = page.access_token;

    // // 4️⃣ Get connected Instagram
    // const igResp = await axios.get(`https://graph.facebook.com/v24.0/${pageId}`, {
    //   params: { fields: 'instagram_business_account', access_token: pageAccessToken }
    // });
    // const instagramBusinessId = igResp.data.instagram_business_account?.id || null;

    // // 5️⃣ Subscribe page to webhook
    // await axios.post(`https://graph.facebook.com/v24.0/${pageId}/subscribed_apps`, null, {
    //   params: {
    //     subscribed_fields: 'messages,messaging_postbacks,leadgen',
    //     access_token: pageAccessToken
    //   }
    // });

    // 6️⃣ Save connection to DB
    const result = await PageConnection.findOneAndUpdate(
      { account_id: pagesResp.data.id },
      {
        $set: {
          ndid: ndid,
          account_name: pagesResp.data.name,
          pages: pagesResp.data?.accounts?.data
        }
      },
      { upsert: true, new: true }
    );
    await IntegrationModel.findOneAndUpdate(
      { ndid: ndid },
      { $set: { meta: true } },
      { upsert: true, new: true }
    );
    console.log('bhbdfhbjgdjg', result);
    res.redirect(`${ENV.META_CONFIG.FRONTEND_URL}/?accountId=${pagesResp.data.id}`);
  } catch (err) {
    // console.error('OAuth error:', err.response?.data || err.message);
    console.log(err);
    res.redirect(`${ENV.META_CONFIG.FRONTEND_URL}/integrations?status=error`);
  }
};

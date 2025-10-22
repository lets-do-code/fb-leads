import { getDB } from '../config/db';

export const getNdid = async (email: string) => {
  try {
    const db = getDB();
    const user = await db.collection('Zucks_users').findOne({ emailId: email });
    return user?.ndid;
  } catch (error) {
    console.log('Error fetching NDID:', error);
  }
};

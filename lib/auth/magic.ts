import { Magic } from '@magic-sdk/admin';

const magicAdmin = new Magic(process.env.MAGIC_SECRET);
export default magicAdmin;

import type { NextApiRequest, NextApiResponse } from 'next'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // FIXME TODO  add "Secure;" into response token will be send only if server is https
    res.setHeader('Set-Cookie', `__refresh_token__=; Expires=-1; SameSite=Strict; HttpOnly; Path=/`);
    res.status(200).send("Loged out");
}

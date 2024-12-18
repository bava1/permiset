export default function middleware(req: any, res: any) {
    res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
    return res;
  }
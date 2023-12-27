// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// 'use server'
//
// // import { cookies } from 'next/headers'
//
// export async function exampleAction(req, res) {
//   // Get cookie
//   // const value = cookies().get('name')?.value
//
//   // Set cookie
//   // cookies().set('name', 'Delba')
//
//   // Delete cookie
//   // cookies().delete('name')
//
//   res.status(200).json({
//     'testing': 'cookies',
//     // 'cookies': cookies()
//   })
//
// }

import Cookies from "cookies";
import {USERID} from "@/services/AppService";

export default function handler(req, res) {

  let cookies = Cookies(req);
  let userId = cookies.get(USERID)
  res.status(200).json({
    name: 'testing cookies',
    userId: userId
    // cookies: cookies(),
  })
}

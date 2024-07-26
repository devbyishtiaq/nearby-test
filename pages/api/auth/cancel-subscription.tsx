import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userInput = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const formdata = new FormData();
    const myHeaders = new Headers();
    formdata.append("email", userInput.email);
    myHeaders.append("Authorization", `Token ${userInput.token}`);

    const apiUrl = `${process.env.BASE_URL}/v1/auth/cancel-payment/`;
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      body: formdata,
      headers: myHeaders,
      redirect: 'follow'
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      try {
        const errorJson = JSON.parse(errorText);
        res.status(apiResponse.status).json(errorJson);
      } catch (e) {
        res.status(apiResponse.status).json({ message: errorText || 'An error occurred' });
      }
      return;
    }

    const responseJson = await apiResponse.json();
    res.status(200).json(responseJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default handler;

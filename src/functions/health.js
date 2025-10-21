export default async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  // if (event.httpMethod === 'OPTIONS') {
  //   return {
  //     statusCode: 200,
  //     headers,
  //     body: ''
  //   };
  // }

  return new Respose({
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      message: "Limbo API is online",
    }),
  });
};

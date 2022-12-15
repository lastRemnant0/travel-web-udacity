async function postData(url, data) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  try {
    const userData = await response.json();
    return userData;
  } catch (err) {
    console.log(`postData function ERROR: ${err}`);
  }
}

export { postData };

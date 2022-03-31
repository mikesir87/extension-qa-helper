export async function getViaProxy(url) {
  const result = await window.ddClient.extension.vm.service.get(
    `/proxy?url=${encodeURIComponent(url)}`
  );
  if (result.status >= 200 && result.status < 300) {
    return JSON.parse(result.data);
  }
  throw new Error(`HttpError: ${JSON.stringify(result, null, 2)}`);
}
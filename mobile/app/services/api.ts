export async function getApiMessage(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Ligação ao serviço simulada com sucesso.");
    }, 500);
  });
}
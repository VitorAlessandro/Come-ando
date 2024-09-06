function status(request, response) {
  response.status(200).json({ chave: "Pão" });
}
export default status;

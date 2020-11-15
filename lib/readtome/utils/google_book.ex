defmodule Readtome.GoogleBook do
  use Tesla

  plug(Tesla.Middleware.BaseUrl, "https://www.googleapis.com/books")
  plug(Tesla.Middleware.JSON)

  def get_book(isbn) do
    with {:ok, response} <- get("/v1/volumes", query: [q: "#{isbn}+isbn", key: Application.fetch_env!(:readtome, :googlebooks_api).key]),
         200 <- response.status do
      {:ok, List.first(response.body["items"])}
    else
      _ -> {:error, :could_not_find_book}
    end
  end
end

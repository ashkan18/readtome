defmodule Readtome.IsbnDb do
  use HTTPotion.Base

  def process_url(url) do
    "https://www.googleapis.com/" <> url
  end

  def process_request_headers(headers) do
    Map.put(headers, :"User-Agent", "github-potion")
  end

  def process_response_body(body) do
    body |> Poison.decode!
  end
end
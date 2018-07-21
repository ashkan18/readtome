defmodule Readtome.GoogleBook do
  use HTTPotion.Base

  def process_url(url) do
    Application.fetch_env!(:readtome, :googlebooks_api).url <> url
  end

  def process_response_body(body) do
    body |> Poison.decode!
  end
end
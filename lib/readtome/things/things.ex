defmodule Readtome.Things do
  def unfurl_link(url) do
    case Furlex.unfurl(url) do
      {:ok, %Furlex{oembed: data}} when not is_nil(data) ->
        IO.inspect(data)
        unfurl_oembed(data)

      {:ok, %Furlex{json_ld: data}} when data !== [] ->
        IO.inspect(data)
        unfurl_json_ld(data)

      {:ok, a = %Furlex{twitter: data}} when not is_nil(data) ->
        IO.inspect(a)
        unfurl_twitter(data)

      error ->
        IO.inspect(error)
        {:error, "Could not unfurl"}
    end
  end

  defp unfurl_json_ld([data | _]) do
    {:ok, %{type: map_types(data["@type"]), title: data["name"]}}
  end

  defp unfurl_oembed(data) do
    {:ok, %{author_name: data["author_name"], thumbnail: data["thumbnail_url"], type: map_types(data["type"]), title: data["title"]}}
  end

  defp unfurl_twitter(data) do
    {:ok, %{thumbnail: data["twitter:image"], type: map_types(data["twitter:creator"] || data["twitter:site"]), title: data["twitter:title"]}}
  end

  defp map_types("MusicRecording"), do: :listened
  defp map_types("@Criterion"), do: :watched
  defp map_types("@goodreads"), do: :read
  defp map_types(something), do: something
end

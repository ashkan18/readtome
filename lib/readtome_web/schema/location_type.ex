defmodule ReadtomeWeb.Schema.LocationType do
  @moduledoc """
  The Location scalar type allows fields with locations.
  """
  use Absinthe.Schema.Notation

  scalar :location, name: "Location" do
    description("""
    Location including lat/lng.
    """)

    serialize(&encode/1)
    parse(&decode/1)
  end

  @spec decode(Absinthe.Blueprint.Input.String.t()) :: {:ok, term()} | :error
  @spec decode(Absinthe.Blueprint.Input.Null.t()) :: {:ok, nil}
  defp decode(%Absinthe.Blueprint.Input.String{value: value}) do
    {:ok, Geo.JSON.decode(value)}
  end

  defp decode(%Absinthe.Blueprint.Input.Null{}) do
    {:ok, nil}
  end

  defp decode(_) do
    :error
  end

  defp encode(value) do
    {:ok, location} = Geo.JSON.encode(value)
    [lng, lat] = location["coordinates"]

    %{
      lat: lat,
      lng: lng
    }
  end
end

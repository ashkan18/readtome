defmodule Readtome.Helper do
  alias Readtome.Repo

  def populate(model, attrs) do
    Repo.preload(model, attrs)
  end

  def convert_changeset_errors(%Ecto.Changeset{errors: errors}) do
    errors
    |> Enum.map(fn {attr, {msg, _}} -> [message: "#{attr}: #{msg}"] end)
  end
end

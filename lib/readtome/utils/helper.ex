defmodule Readtome.Helper do
  alias Readtome.Repo
  def populate(model, attrs) do
    Repo.preload(model, attrs)
  end
end

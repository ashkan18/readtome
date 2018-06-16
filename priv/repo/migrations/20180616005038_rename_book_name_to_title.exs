defmodule Readtome.Repo.Migrations.RenameBookNameToTitle do
  use Ecto.Migration

  def change do
    rename table("books"), :name, to: :title
  end
end

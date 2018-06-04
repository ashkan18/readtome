defmodule Readtome.Repo.Migrations.CreateBooks do
  use Ecto.Migration

  def change do
    create table(:books) do
      add :name, :string
      add :isbn, :string
      add :small_cover_url, :string
      add :medium_cover_url, :string
      add :large_cover_url, :string
      add :condition, :string

      timestamps()
    end

  end
end

defmodule Readtome.Repo.Migrations.CreateAuthors do
  use Ecto.Migration

  def change do
    create table(:authors) do
      add :name, :string
      add :bio, :text

      timestamps()
    end

  end
end

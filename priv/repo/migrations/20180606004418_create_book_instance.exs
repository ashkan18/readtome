defmodule Readtome.Repo.Migrations.CreateBookInstances do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION IF NOT EXISTS postgis"
    create table(:book_instances) do
      add :condition, :string
      add :medium, :string
      add :offerings, :string
      add :location, :geometry
      add :availability, :string

      add :book_id, references(:books, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:book_instances, [:book_id])
  end
end

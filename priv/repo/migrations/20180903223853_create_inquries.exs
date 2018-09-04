defmodule Readtome.Repo.Migrations.CreateInquries do
  use Ecto.Migration

  def change do
    create table(:inquries) do
      add :type, :string
      add :user_id, references(:users, on_delete: :nothing)
      add :book_instance_id, references(:book_instances, on_delete: :nothing)

      timestamps()
    end

    create index(:inquries, [:user_id])
    create index(:inquries, [:book_instance_id])
  end
end

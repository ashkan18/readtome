defmodule Readtome.Repo.Migrations.Createinquiries do
  use Ecto.Migration

  def change do
    create table(:inquiries) do
      add :type, :string
      add :user_id, references(:users, on_delete: :nothing)
      add :book_instance_id, references(:book_instances, on_delete: :nothing)

      timestamps()
    end

    create index(:inquiries, [:user_id])
    create index(:inquiries, [:book_instance_id])
  end
end

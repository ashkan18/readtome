defmodule Readtome.Repo.Migrations.CreateMessages do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :text, :string
      add :inquiry_id, references(:inquiries, on_delete: :nothing)
      add :from_id, references(:users, on_delete: :nothing)
      add :to_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:messages, [:inquiry_id])
    create index(:messages, [:from_id])
    create index(:messages, [:to_id])
  end
end

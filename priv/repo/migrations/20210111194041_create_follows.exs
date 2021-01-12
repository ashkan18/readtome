defmodule Readtome.Repo.Migrations.CreateFollows do
  use Ecto.Migration

  def change do
    create table(:follows) do
      add :user_id, references(:users, on_delete: :nothing)
      add :follower_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:follows, [:user_id])
    create index(:follows, [:follower_id])

    create unique_index(:follows, [:user_id, :follower_id])
  end
end

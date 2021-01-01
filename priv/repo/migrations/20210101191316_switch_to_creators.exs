defmodule Readtome.Repo.Migrations.SwitchToCreators do
  use Ecto.Migration

  def change do
    rename table(:authors), to: table(:creators)
    rename table(:book_authors), to: table(:book_creators)
    rename table(:book_creators), :author_id, to: :creator_id

    create table(:creator_user_interests) do
      add :user_interest_id, references(:user_interests, on_delete: :nothing)
      add :creator_id, references(:creators, on_delete: :nothing)

      timestamps()
    end

    create index(:creator_user_interests, [:user_interest_id])
    create index(:creator_user_interests, [:creator_id])
  end
end

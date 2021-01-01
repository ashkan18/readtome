defmodule Readtome.Repo.Migrations.AddMissingUserInterestCreators do
  use Ecto.Migration

  def change do
    create table(:user_interest_creators) do
      add :user_interest_id, references(:user_interests, on_delete: :nothing)
      add :creator_id, references(:creators, on_delete: :nothing)

      timestamps()
    end
  end
end

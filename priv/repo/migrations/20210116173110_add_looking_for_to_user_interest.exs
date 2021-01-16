defmodule Readtome.Repo.Migrations.AddLookingForToUserInterest do
  use Ecto.Migration

  def change do
    alter table(:user_interests) do
      add :looking_for, :boolean
    end
  end
end

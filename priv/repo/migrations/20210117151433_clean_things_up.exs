defmodule Readtome.Repo.Migrations.CleanThingsUp do
  use Ecto.Migration

  def change do
    drop table(:messages)
    drop table(:inquiries)
    drop table(:book_creators)
    drop table(:book_instances)
    drop table(:books)
    alter table(:user_interests) do
      add :external_id, :string
      add :location, :geometry
      add :metadata, :jsonb
    end
  end
end

defmodule Readtome.Repo.Migrations.AddProfilePhotosToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :photos, :jsonb, null: false, default: "[]"
    end
  end
end

defmodule Readtome.Repo.Migrations.AddThumbnailToUserInterest do
  use Ecto.Migration

  def change do
    alter table(:user_interests) do
      add :thumbnail, :string
    end
  end
end

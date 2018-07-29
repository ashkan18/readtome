defmodule Readtome.Repo.Migrations.AddTagsToBooks do
  use Ecto.Migration

  def change do
    alter table(:books) do
      add :tags, {:array, :string}
    end
  end
end

defmodule Readtome.Repo.Migrations.CreatorUniqness do
  use Ecto.Migration

  def change do
    create unique_index(:creators, [:name])
  end
end

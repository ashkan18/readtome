defmodule Readtome.Repo.Migrations.CleanupBookInstances do
  use Ecto.Migration

  def change do
    alter table(:book_instances) do
      remove :offerings
      remove :condition
      add :offerings, {:array, :string}, default: []
    end
  end
end

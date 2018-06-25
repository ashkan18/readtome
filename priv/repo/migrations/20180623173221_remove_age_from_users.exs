defmodule Readtome.Repo.Migrations.RemoveAgeFromUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      remove :age
      add :birthdate, :date
    end
  end
end

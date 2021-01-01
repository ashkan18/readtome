defmodule Readtome.Repo.Migrations.CreateUserInterests do
  use Ecto.Migration

  def change do
    create table(:user_interests) do
      add :title, :string
      add :type, :string
      add :ref, :string
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

  end
end

defmodule Readtome.Repo.Migrations.AddInquiryState do
  use Ecto.Migration

  def change do
    alter table(:inquiries) do
      add :status, :string, null: false, default: "pending"
    end
  end
end

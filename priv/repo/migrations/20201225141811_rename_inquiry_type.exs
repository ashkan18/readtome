defmodule Readtome.Repo.Migrations.RenameInquiryType do
  use Ecto.Migration

  def change do
    rename table(:inquiries), :type, to: :offering
  end
end

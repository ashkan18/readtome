defmodule Readtome.UserProfile do
  use Arc.Definition

  # Include ecto support (requires package arc_ecto installed):
  # use Arc.Ecto.Definition

  @versions [:original, :thumb]

  # Override the bucket on a per definition basis:
  # def bucket do
  #   :custom_bucket_name
  # end

  # Whitelist file extensions:
  def validate({file, _}) do
    ~w(.jpg .jpeg .png)
      |> Enum.member?(
        String.downcase(Path.extname(file.file_name)))
  end

  # Define a thumbnail transformation:
  def transform(:thumb, _) do
    {:convert, "-strip -thumbnail 250x250^ -gravity center -extent 250x250 -format jpg", :jpg}
  end

  # Override the persisted filenames:
  def filename(version, {file, _scope}) do
    "#{file.file_name}_#{version}"
  end

  # Override the storage directory:
  def storage_dir(_version, {_file, scope}) do
    "uploads/user/#{scope.id}/profiles"
  end

  # Provide a default URL if there hasn't been a file uploaded
  # def default_url(version, scope) do
  #   "/images/avatars/default_#{version}.png"
  # end

  # Specify custom headers for s3 objects
  # Available options are [:cache_control, :content_disposition,
  #    :content_encoding, :content_length, :content_type,
  #    :expect, :expires, :storage_class, :website_redirect_location]
  #
  def s3_object_headers(_version, {file, _scope}) do
    [content_type: MIME.from_path(file.file_name)]
  end

  def acl(:thumb, _), do: :public_read
  def acl(:original, _), do: :public_read
end

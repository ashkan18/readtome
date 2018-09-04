defmodule ReadtomeWeb.InquiryView do
  use ReadtomeWeb, :view
  alias ReadtomeWeb.InquiryView

  def render("index.json", %{inquiries: inquiries}) do
    %{data: render_many(inquiries, InquiryView, "inquiry.json")}
  end

  def render("show.json", %{inquiry: inquiry}) do
    %{data: render_one(inquiry, InquiryView, "inquiry.json")}
  end

  def render("inquiry.json", %{inquiry: inquiry}) do
    %{id: inquiry.id,
      type: inquiry.type,
      book: render_one(inquiry.book_instabce, ReadtomeWeb.BookInstanceView, "book_instance.json"),
      user: render_one(inquiry.user, ReadtomeWeb.UserView, "user.json")}
  end
end

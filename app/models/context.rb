class Context < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :projects

  validates :name, presence: { message: "cannot be blank" }
end

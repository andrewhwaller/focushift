class Partnership < ApplicationRecord
  belongs_to :user
  belongs_to :partner, class_name: "User"
  has_and_belongs_to_many :projects

  validates :name, presence: { message: "cannot be blank" }
  validates_uniqueness_of :name, scope: :user_id
  validates :partner_id, :numericality => true
end

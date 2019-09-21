class Context < ApplicationRecord
  belongs_to :user
  has_many :project_contexts
  has_many :projects, through: :project_contexts

  validates :name, presence: { message: "cannot be blank" }
  validates_uniqueness_of :name, scope: :user_id
end

class Context < ApplicationRecord
  belongs_to :user
  # has_and_belongs_to_many :projects
  has_many :project_contexts
  has_many :projects, through: :project_contexts

  validates :name, presence: { message: "cannot be blank" }
  validates_uniqueness_of :name, scope: :user_id
end

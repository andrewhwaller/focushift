# frozen_string_literal: true

# Partnership model; no methods
class Partnership < ApplicationRecord
  belongs_to :user
  belongs_to :partner, class_name: "User"
  has_many :project_partnerships, dependent: :destroy
  has_many :projects, through: :project_partnerships
  
  validates :name, presence: { message: "cannot be blank" }
  validates_uniqueness_of :name, scope: :user_id
  validates :partner_id, :numericality => true
end

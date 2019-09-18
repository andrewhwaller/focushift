class PartnershipProject < ApplicationRecord
  belongs_to :partnership
  belongs_to :project
end

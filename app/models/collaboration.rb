class Collaboration < ApplicationRecord
  belongs_to :partnership
  belongs_to :project
end

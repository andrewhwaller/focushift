class ChangePartnerIdToBeIntegerInPartnerships < ActiveRecord::Migration[5.2]
  def change
    change_column :partnerships, :partner_id, :integer
  end
end

class CreatePartnerships < ActiveRecord::Migration[5.2]
  def change
    create_table :partnerships do |t|

      t.timestamps
    end
  end
end

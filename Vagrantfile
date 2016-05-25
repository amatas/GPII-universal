# -*- mode: ruby -*-
# vi: set ft=ruby :

require 'json'

require_relative "lib/config_provider.rb"
require_relative "lib/config_provision.rb"
require_relative "lib/config_network.rb"
require_relative "lib/config_folders.rb"

environment_file = File.expand_path (ENV['VAGRANT_ENV_FILE'] || "./vagrant-envs/default.json")
if File.exists?(environment_file)
  environment = JSON.parse(File.read(environment_file))
else
  raise "Environment config file not found"
end

build_hosts_list(environment["vms"])

Vagrant.configure(2) do |config|

  environment["vms"].each do |vm_id, vm_config|

    config.vm.define vm_id, autostart: vm_config["autostart"] do |instance|

      instance.vm.hostname = vm_id

      config_provider(instance, vm_config, environment["global"])

      config_provision(instance, vm_config, vm_id)

      config_network(instance, vm_config)

      config_folders(instance, vm_config)

    end
  end
end


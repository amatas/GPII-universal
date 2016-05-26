# -*- mode: ruby -*-
# vi: set ft=ruby :

def config_provision(instance, vm_config, vm_id)

  basecmd = "sudo PYTHONUNBUFFERED=1 VM_HOSTNAME=#{vm_id} "\
            "ansible-playbook /vagrant/provisioning/base-playbook.yml"
  instance.vm.provision "shell", inline: basecmd
 
  vm_config["apps"].each do |app, config|

    #check if every file is in place
    raise "File provisioning/#{app}-requirements.yml doesn't exist"\
      unless File.file?("provisioning/#{app}-requirements.yml")
    raise "File provisioning/#{app}-vars.yml doesn't exist"\
      unless File.file?("provisioning/#{app}-vagrant-vars.yml")
    raise "File provisioning/#{app}-playbook.yml doesn't exist"\
      unless File.file?("provisioning/#{app}-playbook.yml")
    raise "File provisioning/base-playbook.yml doesn't exist"\
      unless File.file?("provisioning/base-playbook.yml")

    cmds = \
    "sudo ansible-galaxy install -fr /vagrant/provisioning/#{app}-requirements.yml \n"\
    "sudo VARS_FILE=#{app}-vagrant-vars.yml PYTHONUNBUFFERED=1 \\\n"
    config.each do |name, value|
      cmds << name.upcase + "=" + value.to_s + " \\\n"
    end
    if config["deploy"] then
      cmds << "ansible-playbook --tags='install,configure,deploy' /vagrant/provisioning/#{app}-playbook.yml"
    else
      cmds << "ansible-playbook --tags='install,configure' /vagrant/provisioning/#{app}-playbook.yml"
    end
    instance.vm.provision "shell", inline: cmds

  end if vm_config["apps"]

  vm_config["provision"].each do |type, args|
    if type == "shell" then
      shellcmds = ""
      args.each do |cmd|
        shellcmds << cmd
      end
      instance.vm.provision "shell", inline: shellcmds
    end
  end if vm_config["provision"]

  test_file = ENV['TEST_FILE']
  if !test_file.nil? and vm_config["tests_here"] then
    # TODO remove hardcoded path
    test_cmd = "cd /home/vagrant/sync/node_modules/universal && " \
      "DISPLAY=:0 node tests/" + test_file + ".js"
    instance.vm.provision "shell", inline: test_cmd
  end
end

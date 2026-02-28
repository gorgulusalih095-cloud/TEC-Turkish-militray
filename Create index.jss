const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent 
  ] 
});

const prefix = "."; // Komutları başlatmak için kullanılacak işaret (Örn: .yardım)

client.on('ready', () => {
  console.log(`${client.user.tag} olarak giriş yapıldı! Botun şu an aktif.`);
});

client.on('messageCreate', async message => {
  // Mesaj botun kendisinden geliyorsa veya prefix ile başlamıyorsa işlem yapma
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // --- KOMUTLAR ---

  // 1. Selamlaşma
  if (command === 'sa') {
    return message.reply('Aleyküm Selam, hoş geldin! 🤖');
  }

  // 2. Yardım Menüsü
  if (command === 'yardım') {
    const yardımEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Bot Komutları')
      .setDescription('Kullanabileceğin komutlar aşağıdadır:')
      .addFields(
        { name: '.sa', value: 'Selam verir.' },
        { name: '.ping', value: 'Botun hızını ölçer.' },
        { name: '.temizle [sayı]', value: 'Yazılan sayı kadar mesajı siler.' },
        { name: '.avatar', value: 'Profil resmini gösterir.' },
        { name: '.sunucu', value: 'Sunucu bilgilerini gösterir.' }
      )
      .setTimestamp();

    message.reply({ embeds: [yardımEmbed] });
  }

  // 3. Ping Ölçer
  if (command === 'ping') {
    message.reply(`🏓 Pong! Gecikme: **${client.ws.ping}ms**`);
  }

  // 4. Avatar Gösterici
  if (command === 'avatar') {
    const user = message.mentions.users.first() || message.author;
    message.reply(`${user.username} adlı kullanıcının avatarı: ${user.displayAvatarURL({ dynamic: true, size: 1024 })}`);
  }

  // 5. Mesaj Silme (Yetki Gerektirir)
  if (command === 'temizle') {
    if (!message.member.permissions.has('ManageMessages')) return message.reply('Bu komutu kullanmak için `Mesajları Yönet` yetkin olmalı!');
    const miktar = parseInt(args[0]);
    if (isNaN(miktar) || miktar < 1 || miktar > 100) return message.reply('Lütfen 1-100 arasında bir sayı belirt!');
    
    await message.channel.bulkDelete(miktar + 1, true);
    message.channel.send(`✅ **${miktar}** adet mesaj başarıyla silindi.`).then(m => setTimeout(() => m.delete(), 3000));
  }

  // 6. Sunucu Bilgisi
  if (command === 'sunucu') {
    message.reply(`🏰 **Sunucu Adı:** ${message.guild.name}\n👥 **Toplam Üye:** ${message.guild.memberCount}\n🆔 **Sunucu ID:** ${message.guild.id}`);
  }

});

// ÖNEMLİ: Discord Developer Portal'dan aldığın TOKEN'ı aşağıdaki tırnak içine yapıştır.
client.login('MTQ3NzQyMjA1NTg5NjEyMTQwNg.Gfx_ge.Q4RLWhG3zvAzba3GFuakfeTO_yGUjCipP8jVqI');
  // 7. Sunucu Sahibi Komutu
  if (command === 'owner') {
    const owner = await message.guild.fetchOwner();
    message.reply(`👑 **Sunucu Sahibi:** ${owner.user.tag}`);
  }
